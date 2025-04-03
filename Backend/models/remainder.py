import smtplib
import ssl
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import re

# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "ishanp141@gmail.com"
EMAIL_PASSWORD = "lxxa itep sayz agxu"  # Use an App Password for security.
EMAIL_RECEIVER = "ishan.patil23@pccoepune.org"

scheduler = BackgroundScheduler()

def send_email(subject, body):
    """Function to send an email."""
    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = EMAIL_RECEIVER
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, EMAIL_RECEIVER, msg.as_string())
        print(f"✅ Email sent successfully: {subject}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

def schedule_email(reminder_text, time_str):
    """Schedules an email reminder based on the given time string."""
    # Extracting time information
    match = re.search(r"(\d+) (seconds?|minutes?|hours?|days?)", time_str.lower())
    
    if not match:
        print("Invalid time format. Example: 'after 2 days', 'after 30 minutes'.")
        return
    
    value, unit = int(match.group(1)), match.group(2)
    time_delta = None

    if "second" in unit:
        time_delta = timedelta(seconds=value)
    elif "minute" in unit:
        time_delta = timedelta(minutes=value)
    elif "hour" in unit:
        time_delta = timedelta(hours=value)
    elif "day" in unit:
        time_delta = timedelta(days=value)

    if time_delta:
        reminder_time = datetime.now() + time_delta
        scheduler.add_job(send_email, "date", run_date=reminder_time, args=[f"Reminder: {reminder_text}", reminder_text])
        print(f"📅 Reminder set for: {reminder_time} - {reminder_text}")

scheduler.start()
