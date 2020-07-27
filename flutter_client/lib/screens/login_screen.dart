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
        padding: const EdgeInsets.all(50.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              "Enter your username",
              style: Theme.of(context).textTheme.headline1,
            ),
            TextField(
              onChanged: (value) => _username = value,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.headline2,
              decoration: InputDecoration(
                hintText: "username",
              ),
            ),
            RaisedButton(
              child: Text('connect'),
              onPressed: () => Navigator.pushNamed(context, MainScreen.id,
                  arguments: _username),
            )
          ],
        ),
      ),
    );
  }
}
