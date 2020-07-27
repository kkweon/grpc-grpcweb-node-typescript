import 'package:flutter/material.dart';
import 'package:flutter_client/screens/login_screen.dart';
import 'package:flutter_client/screens/main_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: LoginScreen.id,
      routes: {
        MainScreen.id: (context) => MainScreen(),
        LoginScreen.id: (context) => LoginScreen(),
      },
    );
  }
}
