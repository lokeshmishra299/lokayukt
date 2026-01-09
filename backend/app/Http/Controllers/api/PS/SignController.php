<?php

namespace App\Http\Controllers\api\PS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SignController extends Controller
{
     public function generateHash(Request $request)
    {
        $data = $request->input('data');

        // IMPORTANT: Always same order
        $payload = json_encode($data, JSON_UNESCAPED_SLASHES);

        $hash = base64_encode(
            hash('sha256', $payload, true)
        );

        return response()->json([
            'hash' => $hash,
            'payload' => $payload
        ]);
    }

    public function verifySignature(Request $request)
    {
        $payload   = $request->payload;
        $signature = base64_decode($request->signature);
        $certificate = $request->certificate; // DSC public cert

        $publicKey = openssl_pkey_get_public($certificate);

        $verified = openssl_verify(
            $payload,
            $signature,
            $publicKey,
            OPENSSL_ALGO_SHA256
        );

        return response()->json([
            'valid' => $verified === 1
        ]);
    }
}
