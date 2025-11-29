    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>@yield('title', 'LokAyukta CRMS')</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">

        {{-- Header --}}
       {{-- Header --}}
@if (!Request::is('admin/login'))
    @include('partials.header')
@endif


        {{-- Main Content --}}
        <main class="p-4">
            @yield('content')
        </main>

        {{-- Footer --}}
        @include('partials.footer')
 @stack('scripts')
    </body>
    </html>
