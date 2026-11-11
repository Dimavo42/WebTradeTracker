#include "Utilities.h"
#include <stdexcept>
#include <openssl/pem.h>
#include <openssl/x509v3.h>


Utilities::KeyPair Utilities::generateKeys(int keySize){
    if (keySize < 2048) {
        throw std::invalid_argument("Key size must be at least 2048");
    }
    KeyPair keys(
        EVP_PKEY_Q_keygen(
            nullptr, nullptr, "RSA",
            static_cast<size_t>(keySize)
        ),
        EVP_PKEY_free
    );

    if (!keys) {
        throw std::runtime_error("RSA key generation failed");
    }
    return keys;
}



void Utilities::savePublicKey(const std::string& filename, const KeyPair& keys)
{
    if (!keys) {
        throw std::invalid_argument("Missing key pair");
    }

    std::FILE* file = std::fopen(filename.c_str(), "wb");
    if (!file) {
        throw std::runtime_error("Cannot create public key file: " + filename);
    }

    int written = PEM_write_PUBKEY(file, keys.get());
    int closed = std::fclose(file);

    if (written != 1 || closed != 0) {
        throw std::runtime_error("Cannot save public key: " + filename);
    }
}


void Utilities::savePrivateKey(const std::string& filename, const KeyPair& keys)
{
    if (!keys) {
        throw std::invalid_argument("Missing private key");
    }

    std::FILE* file = std::fopen(filename.c_str(), "wb");
    if (!file) {
        throw std::runtime_error("Cannot create key file: " + filename);
    }

    int written = PEM_write_PrivateKey(
        file, keys.get(), nullptr, nullptr, 0, nullptr, nullptr
    );
    int closed = std::fclose(file);

    if (written != 1 || closed != 0) {
        throw std::runtime_error("Cannot save private key: " + filename);
    }
}


void Utilities::saveCertificate(const std::string& filename, const Utilities::KeyPair& keys)
{
    if (!keys) {
        throw std::invalid_argument("Missing key pair");
    }

    std::unique_ptr<X509, decltype(&X509_free)> cert(X509_new(), X509_free);

    if (!cert ||
        X509_set_version(cert.get(), 2) != 1 || // X.509 version 3
        ASN1_INTEGER_set(X509_get_serialNumber(cert.get()), 1) != 1 ||
        !X509_gmtime_adj(X509_getm_notBefore(cert.get()), 0) ||
        !X509_gmtime_adj(X509_getm_notAfter(cert.get()), 30L * 24 * 60 * 60) ||
        X509_set_pubkey(cert.get(), keys.get()) != 1) {
        throw std::runtime_error("Cannot create certificate");
    }

    X509_NAME* subject = X509_get_subject_name(cert.get());
    if (!subject ||
        X509_NAME_add_entry_by_txt(
            subject, "CN", MBSTRING_ASC,
            reinterpret_cast<const unsigned char*>("localhost"),
            -1, -1, 0
        ) != 1 ||
        X509_set_issuer_name(cert.get(), subject) != 1) {
        throw std::runtime_error("Cannot set certificate identity");
    }

    std::unique_ptr<X509_EXTENSION, decltype(&X509_EXTENSION_free)> san(
        X509V3_EXT_conf_nid(nullptr, nullptr, NID_subject_alt_name,
                           "DNS:localhost,IP:127.0.0.1"),
        X509_EXTENSION_free
    );

    if (!san || X509_add_ext(cert.get(), san.get(), -1) != 1 ||
        X509_sign(cert.get(), keys.get(), EVP_sha256()) <= 0) {
        throw std::runtime_error("Cannot sign certificate");
    }

    std::FILE* file = std::fopen(filename.c_str(), "wb");
    if (!file) {
        throw std::runtime_error("Cannot create certificate file: " + filename);
    }

    const int written = PEM_write_X509(file, cert.get());
    const int closed = std::fclose(file);

    if (written != 1 || closed != 0) {
        throw std::runtime_error("Cannot save certificate: " + filename);
    }
}