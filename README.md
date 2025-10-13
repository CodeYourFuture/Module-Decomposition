# Coursework

Exercises to practice and solidify your understanding of the Decomposition module of the Software Development Course.

# Test application

You can test your application by running some curl commands like:

`curl -X POST --data '["Bees"]' -H "X-Username: Ahmed" http://localhost:3000`

When testing **off-the-shelf-middleware**, add `-H 'Content-Type: application/json'` to curl request:

`curl -X POST --data '["Bees"]' -H 'Content-Type: application/json'  -H "X-Username: Ahmed" http://localhost:3000`

This is because express middleware parses JSON only when JSON header is set.
