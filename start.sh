LOG_FILE="$HOME/.pm2/logs/audit-out.log"

echo "Start building server $(date +%Y-%m-%d-%T%Z)" >> $LOG_FILE

pm2 delete audit || {
  echo "Warning: Failed to delete pm2 process, it may not exist" >> $LOG_FILE
}

NODE_ENV='production' pm2 start --name audit ./yarn_preview.sh --log-date-format 'DD-MM HH:mm:ss.SSS' || {
  echo "Error: pm2 start failed" >> $LOG_FILE
  exit 1
}

pm2 save || {
  echo "Warning: Failed to save pm2 process list" >> $LOG_FILE
}

echo "Done building server $(date +%Y-%m-%d-%T%Z)" >> $LOG_FILE
