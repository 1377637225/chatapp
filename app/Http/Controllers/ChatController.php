<?php

namespace App\Http\Controllers;

use App\User;
use App\Events\ChatEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    /**
     * Show chat room
     */
    public function chat()
    {
        return view('chat');
    }

    /**
     * Handle message sending
     * 
     * @param Illuminate\Http\Request $request
     * @return void
     */
    public function send(Request $request)
    {
        
        $user = User::find(Auth::id());

        session()->put('chat',$request->chat);

        event(new ChatEvent($request->message, $user));
    }

    /**
     * Get old message from session
     * 
     * @return session
     */
    public function getOldMessage()
    {
        return session('chat');
    }

    /**
     * Destroy message
     * 
     * @return void
     */
    public function deleteSession()
    {
        session()->forget('chat');
    }
  
}
