import * as crypto from "crypto";

function key_generation(): bigint[] {
    console.log("keygen");
    var p: bigint = 0n; var q: bigint = 0n;
    const array = new Uint16Array(1);
    while (!is_prime(p) && p < ((2n)**(31n))) {
        p = BigInt(crypto.getRandomValues(array)[0]);
    }
    while (!is_prime(q) && q < ((2n)**(31n))) {
        q = BigInt(crypto.getRandomValues(array)[0]);
    }
    const n = p*q;
    const phi = (p - 1n)*(q - 1n);
    // wikipedia defined common e value
    const e: bigint = (2n ** 16n) + 1n; 
    const d = mod_inv(e, phi);
    return [e,n,d];
}

// modular inverse 
// euclid's algorithm can be used to compute this:
// we know that gcd(a,n) = 1 for the multiplicative inverse to exist, 
// => by bezout's id, we have that 1 = ax + yn 
// => x is the mod inv of a

function mod_inv(a: bigint, n: bigint): bigint {
    console.log("mod_inv");
    if (n <= 0n) { return 0n;}    

    let n0 = n;
    let x0 = 0n, x1 = 1n;

    if (n === 1n) { return 0n;}

    a = ((a % n) + n) % n; // ensure a is in [0, m)

    while (a > 1n) {
        if (n === 0n) throw new Error("Inverse does not exist");

        let q = a / n; // quotient
        [a, n] = [n, a % n]; // Euclidean step
        [x0, x1] = [x1 - q * x0, x0];
    }

    if (x1 < 0n) {x1 += n0; }

    return x1;
}

// fast isqrt 
function newton_isqrt(value: bigint): bigint {
    console.log("newton_isqrt");
    if (value < 2n) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> 1n;
        if (x0 === x1 || x0 === (x1 - 1n)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, 1n);
}


function is_prime(n: bigint) : boolean {
    console.log("is_prime");
    if (n % 2n == 0n) { return false; }
    if (n % 3n == 0n) { return false; } 
    if (n % 5n == 0n) { return false; } // required for 
    var k = 1n;
    // all primes > 3 are of the form 6k + 1 or 6k + 5
    // I: n % i != 0, where i = [2, ..., 6k]
    while ((6n*k + 1n) <= newton_isqrt(n)) {
        if (n % (6n*k + 1n) == 0n) { return false; }
        if (n % (6n*k + 5n) == 0n) { return false; }
        k = k + 1n;
    }
    // I && i = [2, ..., sqrt(n)]
    // => n is prime
    return true;
}

function carmichael(n: number): number {
    var k = 1;
    for (var x = 1; x < n; x ++) {
        // while (gcd(x,n) == 1 && !())
    }
    return 0;
} 

// euclid's algorithm !!
function gcd(a: bigint, b: bigint): bigint {
    console.log("gcd");
    var q = 0n; var r = 0n
    while (b > 0n) {
        q = a/b; r = a - (q*b);
        a = b;
        b = r;
    }
    return a;
}


// modular exponentiation 
// HUGE OVERHEAD HERE! will implement binary method
function mod_exp(b: bigint, e: bigint, n: bigint): bigint {
    console.log("mod_exp");
    if (n <= 1n) { return 0n; }
    var c = 1n; var e_2 = 0n;
    while (e_2 < e){
        // I: c = (b ^ e_2) mod n
        c = (c * b) % n;
        e_2 = e_2 + 1n;
        //console.log(e - e_2);
    }
    // I && e_2 == e
    // => c = (b ^ e) mod n
    return c;
}

function encrypt(e: bigint, m: bigint, n:bigint): bigint {
    console.log("encrypt");
    return mod_exp(m,e,n);
}

function decrypt(c: bigint, d:bigint, n: bigint): bigint {
    console.log("decrypt");
    return mod_exp(c,d,n);
}

const e_n_d = key_generation();
const e =e_n_d[0];
const n =e_n_d[1];
const d =e_n_d[2];
const m = 1234n;
console.log(decrypt(encrypt(e, m, n), d, n) == m);
