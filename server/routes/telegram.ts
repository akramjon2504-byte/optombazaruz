import express from 'express';
import { telegramBot } from '../telegram-bot';
import { blogService } from '../services/blog-service';

const router = express.Router();

// Admin routes for Telegram bot
router.post('/telegram/send-marketing', async (req, res) => {
  try {
    await telegramBot.createMarketingPost();
    res.json({ success: true, message: 'Marketing post sent' });
  } catch (error) {
    console.error('Failed to send marketing post:', error);
    res.status(500).json({ error: 'Failed to send marketing post' });
  }
});

router.post('/telegram/create-blog', async (req, res) => {
  try {
    const blogPost = await blogService.createAndSaveBlogPost();
    res.json({ success: true, blogPost });
  } catch (error) {
    console.error('Failed to create blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

router.post('/telegram/send-channel', async (req, res) => {
  try {
    const { message } = req.body;
    await telegramBot.sendToChannel(message);
    res.json({ success: true, message: 'Message sent to channel' });
  } catch (error) {
    console.error('Failed to send to channel:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;