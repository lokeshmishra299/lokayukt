@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

        <form id="loginForm" method="POST" action="{{ url('admin/login') }}">
            @csrf
            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" id="email" class="w-full border rounded p-2">
                <span class="text-red-500 text-sm" id="email_error"></span>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" id="password" class="w-full border rounded p-2">
                <span class="text-red-500 text-sm" id="password_error"></span>
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        </form>

        <div id="responseMessage" class="mt-4 text-center text-sm text-red-500"></div>
    </div>
</div>
@endsection

@push('scripts')
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).on('submit', '#loginForm', function(e) {
    e.preventDefault();
    $(".error-text").text(""); // sab purane error clear karo

    $.ajax({
        url: $(this).attr('action'),
        method: "POST",
        data: $(this).serialize(),
        success: function(response) {
            if (response.status) {
                window.location.href = response.redirect_url;
            }
        },
       error: function(xhr) {
    if (xhr.status === 422) {
        let errors = xhr.responseJSON.errors;
        $.each(errors, function(key, value) {
            $("#" + key + "_error").text(value[0]); 
        });
    }
}

    });
});

</script>
@endpush
