import 'package:flutter_client/generated/chat_service.pbgrpc.dart';
import 'package:grpc/grpc_web.dart';

class ChatService {
  ChatServiceClient _service;

  ChatService() {
    final channel =
        GrpcWebClientChannel.xhr(Uri.parse("https://k8s.kkweon.dev/grpc/"));
    this._service = ChatServiceClient(channel);
  }

  Stream<Message> connectStream(String username) {
    return this
        ._service
        .createStream(new CreateStreamRequest()..username = username)
        .map((event) => event.ensureMessage());
  }

  ResponseFuture<Empty> sendMessage({String username, String message}) {
    final request = SendMessageRequest();
    request.message = Message()
      ..username = username
      ..message = message;
    return this._service.sendMessage(request);
  }
}
