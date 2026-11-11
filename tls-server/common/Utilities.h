#pragma once
#include <openssl/evp.h>
#include <memory>
#include <string>

class Utilities{
    public:
        Utilities() = delete;
        using KeyPair =std::unique_ptr<EVP_PKEY, decltype(&EVP_PKEY_free)>;
        static KeyPair generateKeys(int keySize);
        static void savePrivateKey(const std::string& filename, const KeyPair& keys);
        static void savePublicKey(const std::string& filename, const KeyPair& keys);
        static void saveCertificate(const std::string& filename, const Utilities::KeyPair& keys);
  
};