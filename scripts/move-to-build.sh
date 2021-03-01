#!/bin/bash

cd public
mv * tutorials || echo 'move build files to /tutorials';
mv tutorials/_redirects .
