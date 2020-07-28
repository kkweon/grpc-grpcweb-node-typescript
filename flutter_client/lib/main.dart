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
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      initialRoute: LoginScreen.id,
      onGenerateRoute: (RouteSettings settings) {
        print('build route for ${settings.name}');
        final Map<String, WidgetBuilder> routes = {
          MainScreen.id: (ctx) => MainScreen(settings.arguments),
          LoginScreen.id: (ctx) => LoginScreen(),
        };
        WidgetBuilder builder = routes[settings.name];
        return MaterialPageRoute(builder: (ctx) => builder(ctx));
      },
    );
  }
}
