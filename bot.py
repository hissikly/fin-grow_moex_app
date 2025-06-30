import os
from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
from aiogram.filters import CommandStart
from dotenv import load_dotenv
import asyncio

load_dotenv()

BOT_TOKEN = os.getenv('BOT_TOKEN')
MINIAPP_URL = os.getenv('MINIAPP_URL')

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: types.Message):
    web_app_button = KeyboardButton(text="Открыть FinGrow", web_app=WebAppInfo(url=MINIAPP_URL))
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[web_app_button]], 
        resize_keyboard=True
    )
    await message.answer("Добро пожаловать в FinGrow! Нажмите кнопку ниже, чтобы перейти в миниапп:", reply_markup=keyboard)

if __name__ == "__main__":
    async def main():
        await dp.start_polling(bot)
    asyncio.run(main()) 