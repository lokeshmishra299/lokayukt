<?php

use App\Models\AuditLog;

if (!function_exists('audit_log')) {
    function audit_log(array $data): void
    {
        AuditLog::create([
            'user_id'    => $data['user_id'] ?? null,
            'action'     => $data['action'],
            'entity'     => $data['entity'] ?? null,
            'entity_id'  => $data['entity_id'] ?? null,
            'device_id'  => $data['device_id'],
            'ip_addr'    => $data['ip_addr'] ?? request()->ip(),
            'user_agent' => substr($data['user_agent'] ?? request()->userAgent(), 0, 255),
            'created_at' => now(),
        ]);
    }
}
