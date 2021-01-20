# Electron with worker thread implementation

## Why though ?

Electron-main process is by default running on single thread, so from render process if there's request to process/ load/ CRUD huge amount of synchronous data from OS UI freezes since browser window is also running on the same thread.

## Solution

Before even creating window fork a worker thread
once worker thread is forked inform master thread to initialize browser window
now whenever there's a request from render-process to process synchronous data which might lead UI to 
freeze, just call the worker thread and wait untill work is processed later foward the data to render process.
