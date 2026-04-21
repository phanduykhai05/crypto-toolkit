#include <stdio.h>
#include <openssl/bn.h>

void printBN(char *msg, BIGNUM * a) {
    char * number_str = BN_bn2hex(a);
    printf("%s %s\n", msg, number_str);
    OPENSSL_free(number_str);
}

int main() {
    BN_CTX *ctx = BN_CTX_new();
    BIGNUM *p = BN_new();
    BIGNUM *q = BN_new();
    BIGNUM *e = BN_new();
    BIGNUM *n = BN_new();
    BIGNUM *d = BN_new();
    BIGNUM *phi = BN_new();
    BIGNUM *p_minus_1 = BN_new();
    BIGNUM *q_minus_1 = BN_new();
    BIGNUM *one = BN_new();

    BN_hex2bn(&p, "F7E75FDC469067FFDC4E847C51F452DF"); // [cite: 123]
    BN_hex2bn(&q, "E85CED54AF57E53E092113E62F436F4F"); // [cite: 124]
    BN_hex2bn(&e, "0D88C3"); // [cite: 125]
    BN_dec2bn(&one, "1");

    // n = p * q
    BN_mul(n, p, q, ctx); // [cite: 68]
    // phi = (p-1)*(q-1)
    BN_sub(p_minus_1, p, one); // [cite: 65]
    BN_sub(q_minus_1, q, one);
    BN_mul(phi, p_minus_1, q_minus_1, ctx);
    // d = inv(e) mod phi
    BN_mod_inverse(d, e, phi, ctx); // [cite: 74]

    printBN("Private Key d =", d);

    return 0;
}