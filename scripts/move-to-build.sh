#!/bin/bash

cd public
mv * tutorials || echo 'move build files to /tutorials';
mv tutorials/_redirects .
mv tutorials/404.html .
mv tutorials/404 .
