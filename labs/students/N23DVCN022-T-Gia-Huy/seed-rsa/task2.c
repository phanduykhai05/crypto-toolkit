#include <stdio.h>
#include <openssl/bn.h>

void print_bn(const char *msg, const BIGNUM *a) {
    char *number_str = BN_bn2hex(a);
    printf("%s %s\n", msg, number_str);
    OPENSSL_free(number_str);
}

int main() {
    BN_CTX *ctx = BN_CTX_new();
    BIGNUM *n = BN_new();
    BIGNUM *e = BN_new();
    BIGNUM *m = BN_new();
    BIGNUM *c = BN_new();

    BN_hex2bn(&n, "DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    BN_hex2bn(&e, "010001");
    BN_hex2bn(&m, "4120746f702073656372657421");

    BN_mod_exp(c, m, e, n, ctx);

    print_bn("Message hex M =", m);
    print_bn("Ciphertext C =", c);

    BN_free(n);
    BN_free(e);
    BN_free(m);
    BN_free(c);
    BN_CTX_free(ctx);

    return 0;
}
