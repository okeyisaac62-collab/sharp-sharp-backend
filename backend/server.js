import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Supabase client ───────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Test route ────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Sharp Sharp API is running' });
});

// ── POST /api/create-order ────────────────────────────────────────────────────
app.post('/api/create-order', async (req, res) => {
  try {
    const { customerName, customerEmail, items, total, paymentRef } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        items,
        total,
        payment_ref: paymentRef,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, order: data });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/orders ───────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, orders: data });
  } catch (err) {
    console.error('Get orders error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        res.json({ success: true, order: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
});