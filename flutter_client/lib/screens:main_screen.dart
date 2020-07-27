import 'package:flutter/material.dart';

class MainScreen extends StatelessWidget {
  const MainScreen({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Flutter Web Demo"),
      ),
      body: SafeArea(
        child: Text("Hello World"),
      ),
    );
  }
}
