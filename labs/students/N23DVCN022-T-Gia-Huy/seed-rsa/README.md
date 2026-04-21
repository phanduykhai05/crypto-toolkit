# SEED Labs - RSA Public-Key Encryption and Signature Lab

This folder contains 6 C programs for the SEED RSA lab tasks, using OpenSSL BIGNUM.

## Files
- task1.c: derive private key d
- task2.c: encrypt "A top secret!"
- task3.c: decrypt ciphertext and print recovered ASCII
- task4.c: sign two close messages and compare signatures
- task5.c: verify original and corrupted signature
- task6.c: perform manual certificate-signature RSA decode step

## Build and run manually (Windows/Ubuntu)

```bash
gcc task1.c -lcrypto -o task1
gcc task2.c -lcrypto -o task2
gcc task3.c -lcrypto -o task3
gcc task4.c -lcrypto -o task4
gcc task5.c -lcrypto -o task5
gcc task6.c -lcrypto -o task6
```

Run:

```bash
./task1
./task2
./task3
./task4
./task5
./task6
```

## Run from this project
- Web UI: Asymmetric page -> SEED RSA Lab Runner section.
- CLI helper:

```bash
npm run lab:rsa:run -- 1
npm run lab:rsa:run -- 2
```

If your machine misses `gcc` or OpenSSL development headers/libraries, install them first.
