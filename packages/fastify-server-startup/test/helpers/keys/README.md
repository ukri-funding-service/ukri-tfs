The keypair in this folder is used solely for the `index.test.ts` unit test. `private.pem` is used to sign a JWT, and `public.pem` is used to verify it.

To generate a new keypair, use the following commands:

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

If you update the public key, you'll also need to update the `getWellKnownEndpointKeys` structure in `test/index.test.ts`. To generate a new modulus ('m' value) for the JWK in the unit test, run the following command:

```
openssl rsa -pubin -in public.pem -text -noout | grep -E '^ ' | xargs | sed 's/ //g' | perl -ne 'use MIME::Base64; chomp; @bytes=split(":"); shift @bytes; foreach my $i (0..$#bytes) { $bytes[$i] = hex($bytes[$i]); } print encode_base64(pack("C*", @bytes));'
```

The exponent ('e' value) for the JWK is always 0x10001 ('AQAB' in Base64 encoding).
