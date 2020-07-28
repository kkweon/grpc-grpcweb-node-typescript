import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_client/generated/chat_service.pbgrpc.dart';
import 'package:flutter_client/services/chat_service.dart';
import 'package:intl/intl.dart';

final kDateTimeFormat = DateFormat().add_jms();

class MainScreen extends StatefulWidget {
  static const String id = "main_screen";
  final String username;

  MainScreen(this.username);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  ChatService chatService;

  List<Message> _messages = [];

  StreamSubscription subscription;

  String _message;

  final _messageController = TextEditingController();

  @override
  void initState() {
    super.initState();

    this.chatService = ChatService();

    print("connection created");
    this.subscription = this.chatService.connectStream(widget.username).listen(
      (Message msg) {
        setState(() {
          _messages.add(msg);
        });
      },
      onDone: () {
        print('done');
      },
      onError: (error) {
        print("onError => ");
        print(error);
      },
    );
  }

  @override
  void dispose() {
    super.dispose();
    if (subscription != null) {
      subscription.cancel();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Flutter Web Demo"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(50.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              flex: 9,
              child: ListView.builder(
                shrinkWrap: true,
                itemBuilder: (context, index) =>
                    MessageRenderer(_messages[index]),
                itemCount: _messages.length,
              ),
            ),
            Expanded(
              flex: 1,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      onChanged: (value) => _message = value,
                      decoration: InputDecoration(hintText: "enter a message"),
                      textInputAction: TextInputAction.go,
                      onSubmitted: (msg) => _sendMessage(widget.username, msg),
                    ),
                  ),
                  RaisedButton(
                    child: Icon(
                      Icons.send,
                      color: Theme.of(context).colorScheme.onPrimary,
                    ),
                    color: Theme.of(context).primaryColor,
                    onPressed: () => _sendMessage(widget.username, _message),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  _sendMessage(String username, String message) async {
    await this
        .chatService
        .sendMessage(username: username ?? "???", message: message);
    _messageController.clear();
  }
}

class MessageRenderer extends StatelessWidget {
  final Message message;

  MessageRenderer(this.message);

  @override
  Widget build(BuildContext context) {
    final dateTime =
        kDateTimeFormat.format(message.timestamp.toDateTime().toLocal());
    final username = message.username;
    final msg = message.message;

    return Text("[$dateTime]\t$username:\t$msg");
  }
}
