import 'package:flutter/material.dart';
import 'package:flutter_client/screens/main_screen.dart';

class LoginScreen extends StatefulWidget {
  static const String id = "login_screen";

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String _username;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(200.0),
        child: Center(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: TextField(
                  onChanged: (value) => _username = value,
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headline2,
                  decoration: InputDecoration(
                    hintText: "Enter a username",
                  ),
                  onSubmitted: (username) => goToChatPage(username),
                ),
              ),
              RaisedButton(
                color: Theme.of(context).primaryColor,
                child: Icon(
                  Icons.navigate_next,
                  size: 50,
                  color: Theme.of(context).colorScheme.onPrimary,
                ),
                onPressed: () => goToChatPage(_username),
              )
            ],
          ),
        ),
      ),
    );
  }

  goToChatPage(String username) {
    return Navigator.pushNamed(context, MainScreen.id, arguments: _username);
  }
}
