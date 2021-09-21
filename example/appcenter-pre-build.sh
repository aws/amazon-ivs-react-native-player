#!/usr/bin/env bash

# Creates an .env from ENV variables for use with react-native-config
ENV_WHITELIST=${ENV_WHITELIST:-"^RN_"}
printf "Creating an .env file with the following whitelist:\n"
printf "%s\n" $ENV_WHITELIST
set | egrep -e $ENV_WHITELIST | sed 's/^RN_//g' > .env
printf "\n.env created with contents:\n\n"
cat .env

# create dynamically app-center config based on .env variable
if [ $RN_APP_SECRET_ANDROID ]
then
  json_template='{"app_secret":"%s"}\n'
  json_string=$(printf "$json_template" "$RN_APP_SECRET_ANDROID")
  file="./android/app/src/main/assets/appcenter-config.json"
  echo $json_string > $file
  cat $file
fi
