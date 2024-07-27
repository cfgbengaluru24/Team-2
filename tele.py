

import logging
import re
from telegram import Update, ForceReply
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext

# Set up logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# Regex to match latitude and longitude format
LAT_LONG_REGEX = re.compile(r'^-?\d+\.\d+,-?\d+\.\d+$')

# Start command handler
async def start(update: Update, context: CallbackContext) -> None:
    user = update.effective_user
    # Ask for full name
    await update.message.reply_text(
        f"Hi {user.first_name}, please provide your full name.",
        reply_markup=ForceReply(selective=True),
    )
    context.user_data['step'] = 'name'  # Set the step to 'name'

# Handle text message (for full name)
async def handle_text(update: Update, context: CallbackContext) -> None:
    user = update.effective_user
    step = context.user_data.get('step')

    if step == 'name':
        # Store the name
        context.user_data['name'] = update.message.text
        # Ask for image
        await update.message.reply_text(
            "Thank you for providing your name. Now, please send me an image.",
            reply_markup=ForceReply(selective=True),
        )
        context.user_data['step'] = 'photo'  # Move to the next step
    
    elif step == 'photo':
        # Handle photo
        photo = update.message.photo[-1]
        photo_file = await photo.get_file()
        
        # Save the photo file
        file_path = f'{user.id}_photo'
        await photo_file.download_to_drive(file_path)
        logger.info(f"Photo downloaded successfully to {file_path}")

        # Store the photo path
        context.user_data['photo_path'] = file_path
        
        # Ask for location in latitude,longitude format
        await update.message.reply_text(
            "Thank you for sending the image. Please provide your location in the format 'latitude,longitude'.",
            reply_markup=ForceReply(selective=True),
        )
        context.user_data['step'] = 'location'  # Move to the next step
    
    elif step == 'location':
        # Handle latitude and longitude
        message_text = update.message.text

        if LAT_LONG_REGEX.match(message_text):
            # Store the location
            context.user_data['location'] = message_text
            
            # Send thank you message and end the conversation
            await update.message.reply_text(
                f"Thank you {user.first_name}! We have received your name, image, and location. We will get back to you soon with further updates.",
                reply_markup=ForceReply(selective=True),
            )
            
            # Optionally save user data to a file or database here
            # For demonstration purposes, save to a text file
            with open(f'{user.id}_info.txt', 'w') as f:
                f.write(f"Name: {context.user_data['name']}\n")
                f.write(f"Location: {context.user_data['location']}\n")
                f.write(f"Image Path: {context.user_data['photo_path']}\n")
            
            # Clear user data after processing
            context.user_data.clear()
        
        else:
            await update.message.reply_text(
                "Please provide a valid location in the format 'latitude,longitude'.",
                reply_markup=ForceReply(selective=True),
            )
    else:
        await update.message.reply_text(
            "I'm not sure how to handle this message. Please start over by sending /start.",
            reply_markup=ForceReply(selective=True),
        )

def main():
    # Replace 'YOUR_TOKEN' with your actual bot token
    bot_token = ""
    
    # Create the Application and pass it your bot's token
    application = Application.builder().token(bot_token).build()

    # Add handlers
    application.add_handler(CommandHandler('start', start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    application.add_handler(MessageHandler(filters.PHOTO, handle_text))  # Handling photo in the same function

    # Start the Bot
    application.run_polling()

if __name__ == "__main__":
    main()
