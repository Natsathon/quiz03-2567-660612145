import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId } = body;

  const foundRoom = DB.rooms.find(() => roomId === roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
}

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId, messageText } = body; 

  const foundRoom = DB.rooms.find(() => roomId === roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  foundRoom.messages.push({
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken(); 
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const body = await request.json();
  const { roomId, messageId } = body;

  const foundRoom = DB.rooms.find(() => roomId === roomId);
  if (!foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        messageId,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: "Message has been deleted",
  });
};
