from flask import Flask, request, Response, jsonify, json, render_template
from flask_cors import CORS
import cv2
import os
import time
import sys
import operator
import subprocess
from random import randint

app = Flask(__name__)
CORS(app)




class Player():

    def __init__(self):
        self.id = None
        self.name = None
        self.team = 0
        self.pointsGame = 0
        self.medalGold = 0
        self.medalSilver = 0
        self.medalBronze = 0
        self.pointsAllGames = 0
    def toJSON(self):
        return {'id': self.id,
                'name': self.name,
                'team': self.team,
                'pointsGame': self.pointsGame,
                'medalGold': self.medalGold,
                'medalSilver': self.medalSilver,
                'medalBronze': self.medalBronze,
                'pointsAllGames': self.pointsAllGames

                }

class Game:
    def __init__(self):
        self.timeCreation = None
        self.players = {}
        self.numberTeams = 0
        self.ipAddress = None
        self.playGame = 'NoGame'
        self.listPlayers = None
        self.shanghaiNumber = 1
        self.playerTurno = 0
        self.playerThrow = 0
        self.currentPlayer = None

games = {}
streaming = {}

def createOrGetGame(ipAddress):
    if ipAddress in games.keys():
        return games[ipAddress]
    else:
        game = Game()
        game.ipAddress = ipAddress
        game.timeCreation =  time.time()
        games[ipAddress] = game

        return game


ip_local = "127.0.0.1"
game = createOrGetGame(ip_local)

player1 = Player()
player1.id = 1
player1.name = "Christian Anderson"
game.players[player1.id] = player1

player2 = Player()
player2.id = 2
player2.name = "Caroline Hamilton"
game.players[player2.id] = player2

player3 = Player()
player3.id = 3
player3.name = "Nicholas Davidson"
game.players[player3.id] = player3

player4 = Player()
player4.id = 4
player4.name = "Ana Gonzalez"
game.players[player4.id] = player4

player1.pointsGame = 0
player2.pointsGame = 0
player3.pointsGame = 0
player4.pointsGame = 0

@app.route('/darts/players', methods=['GET'])
def getPlayers():
    player1.team = 0
    player2.team = 0
    player3.team = 0
    player4.team = 0
    game = createOrGetGame(request.environ.get('HTTP_X_REAL_IP', request.remote_addr))
    sortedPlayers = sorted( list(game.players.values()), key=operator.attrgetter('team'))

    playersText = ""
    for p in sortedPlayers:
        playersText += str(p.id) +","
        playersText += p.name +","
        playersText += str(p.team) +";"
    return playersText

@app.route('/darts/playersTeam', methods=['GET'])
def getPlayersTeam():
    player1.team = 1
    player2.team = 1
    player3.team = 2
    player4.team = 2
    game = createOrGetGame(request.environ.get('HTTP_X_REAL_IP', request.remote_addr))
    sortedPlayers = sorted( list(game.players.values()), key=operator.attrgetter('team'))

    playersText = ""
    for p in sortedPlayers:
        playersText += str(p.id) +","
        playersText += p.name +","
        playersText += str(p.team) +";"
    return playersText




if __name__ == '__main__':
    app.run(host='localhost', debug=True, port=5000)
