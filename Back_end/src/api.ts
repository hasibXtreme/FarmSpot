import knex from 'knex';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const jwt_secret = process.env.JWT_SECRET || 'secret_dev_key';

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'Hasib',
    password: '69420',
    database: 'farm_db',
  },
});

async function initdb() {
  try {
    await db.raw('SELECT 1');
    console.log('Connected to local PostgreSQL database successfully');

    const hastable = await db.schema.hasTable('user');
    if (!hastable) {
      await db.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.enum('role', ['buyer', 'farmer']).notNullable().defaultTo('buyer');
        table.timestamps(true, true);
      });
      console.log('Created user table successfully');
    }

    const hasfarmertable = await db.schema.hasTable('farmertable');
    if (!hasfarmertable) {
      await db.schema.createTable('farmertable', (table) => {
        table.increments('id').primary();
        table.string('produce').notNullable();
        table.integer('amount').notNullable();
        table.decimal('price');
        table.string('phn_number').notNullable();
        table.text('location');
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      });
      console.log('Created farmer table successfully');
    }

    const hasprodtable = await db.schema.hasTable('prodtable');
    if (!hasprodtable) {
      await db.schema.createTable('prodtable', (table) => {
        table.increments('id').primary();
        table.text('order').notNullable();
        table.string('phn_number').notNullable();
        table.timestamp('deadline');
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE');
        table.timestamps(true, true);
      });
      console.log('Created product table successfully');
    }
  } catch (err) {
    console.error('Failed to initialize database tables:', err);
  }
}

// Initialize tables on application startup
initdb();

// ================= AUTH ROUTES =================

app.post('/api/register', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userexists = await db('user').where({ email }).first();

    if (userexists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedpass = await bcrypt.hash(password, 10);

    await db('user').insert({
      name,
      email,
      password: hashedpass,
      role: role || 'buyer',
    });

    return res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Registration failed', error: err });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await db('user').where({ email }).first();
    if (!user) {
      return res.status(401).json({ message: 'User does not exist', authenticated: false });
    }

    const passcheck = await bcrypt.compare(password, user.password);
    if (!passcheck) {
      return res.status(401).json({ message: 'Password is incorrect', authenticated: false });
    }

    const token = jwt.sign(
      { userid: user.id, email: user.email, role: user.role },
      String(jwt_secret),
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3600000,
    });

    return res.status(200).json({ success: true, authenticated: true, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server issues!! Login failed!!', authenticated: false });
  }
});

app.post('/api/logout', async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  });
  return res.json({ message: 'Logged out' });
});

app.get('/api/verify', async (req: Request, res: Response) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'YOU SHALL NOT PASS!!!', authenticated: false });
  }

  try {
    const decoded_token = jwt.verify(token, String(jwt_secret)) as {
      userid: number;
      email: string;
      role: string;
    };
    return res.json({ authenticated: true, email: decoded_token.email, role: decoded_token.role });
  } catch {
    return res.status(401).json({ authenticated: false, message: 'Invalid or expired token' });
  }
});

// ================= FARMER PRODUCE ROUTES =================

app.post('/api/product', async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'You shall not pass' });
  }

  const { produce, amount, price, location, phn_number } = req.body;
  if (!produce || !amount) {
    return res.status(400).json({ message: 'Produce and amount is compulsory' });
  }

  try {
    const decoded = jwt.verify(token, String(jwt_secret)) as { userid: number; email: string; role: string };
    const [newprod] = await db('farmertable')
      .insert({
        produce,
        amount,
        price,
        phn_number,
        location,
        user_id: decoded.userid,
      })
      .returning('*');

    return res.status(201).json({ newprod });
  } catch (err) {
    console.error('Product insertion error:', err);
    return res.status(500).json({ message: 'Error occurred while saving produce' });
  }
});

app.get('/api/product/today', async (req: Request, res: Response) => {
  try {
    const todayproduce = await db('farmertable')
      .join('user', 'farmertable.user_id', 'user.id')
      .whereRaw(`farmertable.created_at::date = CURRENT_DATE`)
      .select(
        'farmertable.id',
        'farmertable.produce',
        'farmertable.amount',
        'farmertable.price',
        'farmertable.phn_number',
        'farmertable.location',
        'farmertable.created_at',
        'user.name as farmer_name',
        'user.email as farmer_email'
      );

    return res.status(200).json(todayproduce);
  } catch (err) {
    console.error('Fetch today produce error:', err);
    return res.status(500).json({ message: 'Error fetching produce for the day' });
  }
});

// ================= BUYER ORDER ROUTES =================

app.get('/api/order/recent', async (req: Request, res: Response) => {
  try {
    const recentorders = await db('prodtable')
      .join('user', 'prodtable.user_id', 'user.id')
      .whereRaw(`prodtable.created_at >= NOW() - INTERVAL '7 days'`)
      .select(
        'prodtable.id',
        'prodtable.order',
        'prodtable.phn_number',
        'prodtable.deadline',
        'prodtable.created_at',
        'user.name as buyer_name',
        'user.email as buyer_email'
      );

    return res.status(200).json(recentorders);
  } catch (err) {
    console.error('Fetch recent orders error:', err);
    return res.status(500).json({ message: 'Error fetching recent orders' });
  }
});

app.post('/api/order', async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'YOU SHALL NOT PASS!!' });
  }

  const { order, phn_number, deadline } = req.body;
  if (!order || !phn_number) {
    return res.status(400).json({ message: 'Order and phone number is compulsory' });
  }

  try {
    const decoded = jwt.verify(token, String(jwt_secret)) as { userid: number; email: string; role: string };
    const [neworder] = await db('prodtable')
      .insert({
        order,
        phn_number,
        deadline: deadline || null,
        user_id: decoded.userid,
      })
      .returning('*');

    return res.status(201).json({ neworder });
  } catch (err) {
    console.error('Order insertion error:', err);
    return res.status(500).json({ message: 'Error occurred while saving order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});