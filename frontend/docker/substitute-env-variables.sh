#!/bin/bash

#####################################################################
# Substitutes the given environment variables in the given files.
# Parameters:
# $1: Comma-delimited list of file paths
# $2: Comma-delimited list of environment variables
# $3: Absolute path to nginx html directory (optional)
# $4: Should restart nginx (optional)
#####################################################################

echo 'Substituting environment variables...'
num_args=0

# The first parameter is a comma-delimited list of paths to files which should be substituted
if [[ -z $1 ]]; then
  echo 'ERROR: No target files given.'
  exit 1
else
  num_args=1
fi

# The second parameter is a comma-delimited list of environment variable names
if [[ -z $2 ]]; then
  echo 'ERROR: No environment variables given.'
  exit 1
else
  num_args=2
fi

# The third parameter is the absolute path to the nginx html directory
if [[ -z $3 ]]; then
  echo ''  # It's optional. Don't print anything.
else
  num_args=3
fi

# The fourth parameter, if 'true', is whether we should reload nginx
if [[ -z $4 ]]; then
  echo ''  # It's optional. Don't print anything.
else
  num_args=4
fi

# Find & replace BASE_HREF in all files in the nginx html directory
if [[ "$2" == *"BASE_HREF"* ]] && [[ "$2" == *"DEPLOY_URL"* ]]; then
  # Add trailing slash to $BASE_HREF if needed
  length=${#BASE_HREF}
  last_char=${BASE_HREF:length-1:1}
  [[ $last_char != "/" ]] && BASE_HREF="$BASE_HREF/"; :

  # Add trailing slash to $DEPLOY_URL if needed
  length=${#DEPLOY_URL}
  last_char=${DEPLOY_URL:length-1:1}
  [[ $last_char != "/" ]] && DEPLOY_URL="$DEPLOY_URL/"; :

  # The third parameter is the absolute path to the nginx html directory
  if [[ $num_args -ge 3 ]]; then
    # Replace all instances of __REPLACE_ME_WITH_BASE_HREF__ with $BASE_HREF
    find "$3" \( -type d -name .git -prune \) -o -type f -print0 | \
      xargs -0 sed -i 's@__REPLACE_ME_WITH_BASE_HREF__@'"$BASE_HREF"'@g'

    echo 'Replacing base href...'
    #  Wait a few seconds in case find | sed needs more time
    sleep 3

    # Replace all instances of __REPLACE_ME_WITH_DEPLOY_URL__ with $DEPLOY_URL
    find "$3" \( -type d -name .git -prune \) -o -type f -print0 | \
      xargs -0 sed -i 's@__REPLACE_ME_WITH_DEPLOY_URL__@'"$DEPLOY_URL"'@g'

    echo 'Replacing deploy url...'
    #  Wait a few seconds in case find | sed needs more time
    sleep 3
  fi
fi

# Convert "VAR1,VAR2,VAR3,..." to "\$VAR1 \$VAR2 \$VAR3 ..."
env_list="\\\$${2//,/ \\\$}"  # "\" and "$" are escaped as "\\" and "\$"
for file_path in ${1//,/ }
do
  echo "replacing environment variables in $file_path"

  # Replace strings in the given file(s) in env_list
  envsubst "$env_list" < "$file_path" > "$file_path".tmp && mv "$file_path".tmp "$file_path"

  echo '...'
  #  Wait a second in case envsubst needs more time
  sleep 1

  # If this is the nginx default.conf file, replace double slashes with single slashes
  if [[ $file_path == *"/default.conf"* ]]; then
    sed -i -e 's@//@/@g' "$file_path"
  fi
done

echo 'Finished substituting environment variables.'
for env_var in ${2//,/ }
do
  echo "$env_var = ${!env_var}"
done

# Reload nginx
if [ $num_args -ge 4 ] && [ "$4" == "true" ]; then
  # Check to see if nginx command is available
  if hash nginx 2> /dev/null; then
    # Check to see if nginx is already running
    if [ -e /var/run/nginx.pid ]; then
      echo "nginx is currently running. Reloading nginx..."
      exec nginx -s reload
      echo "nginx reloaded."
    else
      echo "nginx is not yet running. Starting nginx..."
      exec nginx -g 'daemon off;'
      echo "nginx started."
    fi
  else
    echo "nginx command not found on this system."
  fi
fi

# Execute all other commands with parameters
num_args=$((num_args + 1))
exec "${@:num_args}"
