#include <stdio.h>
#include <openssl/bn.h>

void print_bn(const char *msg, const BIGNUM *a) {
    char *number_str = BN_bn2hex(a);
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

    BN_hex2bn(&p, "F7E75FDC469067FFDC4E847C51F452DF");
    BN_hex2bn(&q, "E85CED54AF57E53E092113E62F436F4F");
    BN_hex2bn(&e, "0D88C3");
    BN_dec2bn(&one, "1");

    BN_mul(n, p, q, ctx);
    BN_sub(p_minus_1, p, one);
    BN_sub(q_minus_1, q, one);
    BN_mul(phi, p_minus_1, q_minus_1, ctx);
    BN_mod_inverse(d, e, phi, ctx);

    print_bn("n =", n);
    print_bn("phi(n) =", phi);
    print_bn("Private key d =", d);

    BN_free(p);
    BN_free(q);
    BN_free(e);
    BN_free(n);
    BN_free(d);
    BN_free(phi);
    BN_free(p_minus_1);
    BN_free(q_minus_1);
    BN_free(one);
    BN_CTX_free(ctx);

    return 0;
}
