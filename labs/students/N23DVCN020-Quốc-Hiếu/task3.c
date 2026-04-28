#include <stdio.h>

unsigned char xyz[200] = {
    [0 ... 199] = 0x41
};

int main()
{
    for (int i = 0; i < 200; i++) {
        printf("%02x", xyz[i]);
    }
    printf("\n");
}