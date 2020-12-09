# string-hash-64

[![Build Status](https://travis-ci.org/mstdokumaci/string-hash-64.svg?branch=master)](https://travis-ci.org/mstdokumaci/string-hash-64)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/string-hash-64.svg)](https://badge.fury.io/js/string-hash-64)

An improved version of djb2. Generates 64 bit integer hashes. Returns a number between 0 and 18446744073709552000.

Repository includes test for hashing 65 million strings with zero collisions. That's 400k+ less than what you get with djb2.

Performs as fast as djb2, only the generated hashes will consume almost twice memory in size.
