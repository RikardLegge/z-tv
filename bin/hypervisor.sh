#!/bin/bash
cd "$(dirname "$0")"

./run.sh &

while :
do
	sleep 10
  if git checkout master &&
     git fetch origin master &&
     [ `git rev-list HEAD...origin/master --count` != 0 ]
  then
    git reset --hard origin/master
    echo 'A new update is available!'
    echo "Killing electron process"
    ps -ef | grep electron | grep -v grep | awk '{print $2;}' | xargs kill -9
    echo "Starting new process"
    ./run.sh &
  else
    echo 'Nothing new'
  fi
done

