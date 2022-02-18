#!/bin/bash

source '.env'

$(npm bin)/ganache-cli --deterministic "myth like bonus scare over problem client lizard pioneer submit female collect" --port 8545 --fork $TESTNET_URL --unlock 0xbe0eb53f46cd790cd13851d5eff43d12404d33e8 --unlock 0x638E5DA0EEbbA58c67567bcEb4Ab2dc8D34853FB