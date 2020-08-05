#! /usr/bin/env bash
set -e

host=$DEV_ONLINE_HOST
ssh_port=$DEV_ONLINE_SSH_PORT
user=$DEV_ONLINE_USER
data_path=$DEV_ONLINE_DATA_PATH
id=$GITHUB_OAUTH_ID
secrety=$GITHUB_OAUTH_SECRET
node_env=$DEV_ONLINE_NODE_ENV
origin=$DEV_ONLINE_ORIGIN
port=$DEV_ONLINE_SERVER_PORT


pkg="netlify-cms-github-oauth-provider-$BRANCH_NAME-assets.tar.gz"

# Upload web assets to dev online server
# echo "rsync -vaz --progress '-e ssh -p '$ssh_port $pkg $user@$host:$data_path/"
rsync -vaz --progress '-e ssh -p '$ssh_port $pkg $user@$host:$data_path/

# Check exit status of previous command
if [ $? != 0 ]; then
  exit 1
fi

echo 'Deploying...'
ssh -p $ssh_port $user@$host \
  "
  cd $data_path  
  && pwd
  # rm -rf master
  # ls 
  # mkdir master 
  # ls
  # tar -zxf $pkg -C master 
  # rm -rf $pkg 
  # cd master 
  # export OAUTH_CLIENT_ID=$id 
  # export OAUTH_CLIENT_SECRET=$secrety 
  # export ORIGIN=$origin 
  # export PORT=$port
  # export NODE_ENV=$node_env
  # node index.js
  "

# Check exit status of previous command
if [ $? != 0 ]; then
  exit 1
fi
