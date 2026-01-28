<?php

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

if (!function_exists('get_device_id')) {
    function get_device_id(): string
    {
        $deviceId = request()->cookie('device_id');

        if ($deviceId && preg_match('/^[a-f0-9]{32}$/', $deviceId)) {
            return $deviceId;
        }

        $deviceId = Str::random(32); // 32 chars

        Cookie::queue(
            Cookie::make(
                'device_id',
                $deviceId,
                60 * 24 * 365, // 1 year
                '/',
                null,
                request()->isSecure(),
                true,
                false,
                'Lax'
            )
        );

        return $deviceId;
    }
}
