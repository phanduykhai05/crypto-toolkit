#include <stdio.h>
#include <string.h>
#include <openssl/bn.h>

void print_bn(const char *msg, const BIGNUM *a) {
    char *number_str = BN_bn2hex(a);
    printf("%s %s\n", msg, number_str);
    OPENSSL_free(number_str);
}

void print_ascii_from_hex(const char *hex) {
    size_t len = strlen(hex);
    if (len % 2 != 0) {
        printf("Cannot decode odd-length hex string: %s\n", hex);
        return;
    }

    printf("Recovered ASCII = ");
    for (size_t i = 0; i < len; i += 2) {
        unsigned int value = 0;
        sscanf(hex + i, "%2x", &value);
        printf("%c", (char)value);
    }
    printf("\n");
}

int main() {
    BN_CTX *ctx = BN_CTX_new();
    BIGNUM *n = BN_new();
    BIGNUM *d = BN_new();
    BIGNUM *c = BN_new();
    BIGNUM *m = BN_new();

    BN_hex2bn(&n, "DCBFFE3E51F62E09CE7032E2677A78946A849DC4CDDE3A4D0CB81629242FB1A5");
    BN_hex2bn(&d, "74D806F9F3A62BAE331FFE3F0A68AFE35B3D2E4794148AACBC26AA381CD7D30D");
    BN_hex2bn(&c, "8C0F971DF2F3672B28811407E2DABBE1DA0FEBBBDFC7DCB67396567EA1E2493F");

    BN_mod_exp(m, c, d, n, ctx);

    print_bn("Ciphertext C =", c);
    print_bn("Decrypted M (hex) =", m);

    char *hex = BN_bn2hex(m);
    print_ascii_from_hex(hex);
    OPENSSL_free(hex);

    BN_free(n);
    BN_free(d);
    BN_free(c);
    BN_free(m);
    BN_CTX_free(ctx);

    return 0;
}
