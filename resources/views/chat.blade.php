<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{csrf_token()}}">
    <title>Document</title>
    <link rel="stylesheet" href="{{asset('css/app.css')}}">
    <style>
    .list-group{
        overflow-y:scroll;
        height:300px;
    }
    </style>
</head>
<body>
    <div class="container">
        <div class="row" id="app">
            <div class="offset-4 col-4">
                <li class="list-group-item active">Chat Room</li>
                <ul class="list-group" v-chat-scroll>
                <message
                v-for="value in chat.message"
                :key="value.index"
                color="success">
                    @{{value}}
                </message>
                </ul>
                <input type="text" class="form-control" placeholder="Type any message here!" v-model="message" v-on:keyup.enter="send">
            </div>
        </div>
    </div>
    <script src="{{asset('js/app.js')}}"></script>
</body>
</html>