'''
    on_player_joined_test.py
    
    Tests to see if TWO_PLAYER list fills correctly after 
    three new users join through the on_player_joined function.
'''

import unittest
from app import on_player_joined, TWO_PLAYER, OVERALL_LST, DISPLAY_LST, NUM_PLAYERS

DATA_INPUT = "username"
EXPECTED_OUTPUT = "expected"
#OVERALL_LST[0] = "chris123"

class PlayerJoinedTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
                DATA_INPUT: {
                    'sid': "abcfwenrkl12",
                    'username': "chris123",
                    'num_players': 0,
                    'two_players': [],
                    'players': []
                },
                EXPECTED_OUTPUT: ["abcfwenrkl12", ""]
            },
            {
                #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
                DATA_INPUT: {
                    'sid': "beeber1e8332",
                    'username': "bob123",
                    'num_players': 1,
                    'two_players': [],
                    'players': []
                },
                EXPECTED_OUTPUT: ["abcfwenrkl12", "beeber1e8332"]
            },
            {
                #{ sid: socket.id, username : username, num_players: num_players, two_players: [], players: [] }
                DATA_INPUT: {
                    'sid': "bumble2893",
                    'username': "steve123",
                    'num_players': 2,
                    'two_players': [],
                    'players': []
                },
                EXPECTED_OUTPUT: ["abcfwenrkl12", "beeber1e8332"]
            }
        ]

    def test_player_joined(self):
        for test in self.success_test_params:
            actual_result = on_player_joined(test[DATA_INPUT])
            
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()