<nav class="bg-blue-600 p-4 text-white flex justify-between">
    <div class="text-xl font-bold">LokAyukta CRMS</div>
    <ul class="flex space-x-4">
        <li><a href="{{ url('/dashboard') }}" class="hover:underline">Dashboard</a></li>
        <li><a href="#" class="hover:underline">Complaints</a></li>
        <li><a href="#" class="hover:underline">Reports</a></li>
        <li><a href="{{url('/logout') }}" class="hover:underline">Logout</a></li>
    </ul>
</nav>
