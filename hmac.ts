const crypto = require('crypto');

export interface hmacFn {
    (input : string, key : string) : string
}

export const hs256 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('sha256', key)
        .update(input)
        .digest('base64');
}

export const hs384 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('sha384', key)
        .update(input)
        .digest('base64');
}

export const hs512 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('sha512', key)
        .update(input)
        .digest('base64');
}

export const rs256 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('rs256', key)
        .update(input)
        .digest('base64');
}

export const rs384 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('rs384', key)
        .update(input)
        .digest('base64');
}

export const rs512 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('rs512', key)
        .update(input)
        .digest('base64');
}

export const es256 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('es256', key)
        .update(input)
        .digest('base64');
}

export const es384 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('es384', key)
        .update(input)
        .digest('base64');
}

export const es512 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('es512', key)
        .update(input)
        .digest('base64');
}

export const ps256 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('ps256', key)
        .update(input)
        .digest('base64');
}

export const ps384 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('ps384', key)
        .update(input)
        .digest('base64');
}

export const ps512 : hmacFn = function(input : string, key : string) : string {
    return crypto.createHmac('ps512', key)
        .update(input)
        .digest('base64');
}