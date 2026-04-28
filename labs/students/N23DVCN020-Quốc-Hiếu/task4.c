#include <stdio.h>
#include <string.h>

unsigned char X[200] = {
    [0 ... 199] = 0x41
};

unsigned char Y[200] = {
    [0 ... 199] = 0x41
};

int main() {
    if (memcmp(X, Y, 200) == 0) {
        printf("BENIGN CODE EXECUTED\n");
    } else {
        printf("MALICIOUS CODE EXECUTED\n");
    }
    return 0;
}