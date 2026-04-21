#include <stdio.h>
#include <openssl/bn.h>

void print_bn(const char *msg, const BIGNUM *a) {
    char *number_str = BN_bn2hex(a);
    printf("%s %s\n", msg, number_str);
    OPENSSL_free(number_str);
}

void verify_signature_case(const char *label, const char *signature_hex, BIGNUM *e, BIGNUM *n, BN_CTX *ctx) {
    BIGNUM *s = BN_new();
    BIGNUM *m_prime = BN_new();
    BIGNUM *expected = BN_new();

    BN_hex2bn(&s, signature_hex);
    BN_hex2bn(&expected, "4C61756E63682061206D697373696C652E");

    BN_mod_exp(m_prime, s, e, n, ctx);

    printf("%s\n", label);
    print_bn("Recovered message M' =", m_prime);

    if (BN_cmp(m_prime, expected) == 0) {
        printf("Verification result: VALID signature.\n\n");
    } else {
        printf("Verification result: INVALID signature.\n\n");
    }

    BN_free(s);
    BN_free(m_prime);
    BN_free(expected);
}

int main() {
    BN_CTX *ctx = BN_CTX_new();
    BIGNUM *n = BN_new();
    BIGNUM *e = BN_new();

    BN_hex2bn(&n, "AE1CD4DC432798D933779FBD46C6E1247F0CF1233595113AA51B450F18116115");
    BN_hex2bn(&e, "010001");

    verify_signature_case(
        "Case 1: Original signature (ending with 2F)",
        "643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6802F",
        e,
        n,
        ctx
    );

    verify_signature_case(
        "Case 2: Corrupted signature (last byte changed to 3F)",
        "643D6F34902D9C7EC90CB0B2BCA36C47FA37165C0005CAB026C0542CBDB6803F",
        e,
        n,
        ctx
    );

    BN_free(n);
    BN_free(e);
    BN_CTX_free(ctx);

    return 0;
}
