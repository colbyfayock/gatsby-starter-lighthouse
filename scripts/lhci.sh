#!/bin/bash

for entry in "./.lighthouseci"/*
do
  NAME="${entry##*/}"
  TIMESTAMP="$(date +%s)"
  LOCATION="./reports/$TIMESTAMP-$NAME"
  echo "Moving $entry to $LOCATION"
  mv $entry $LOCATION
done