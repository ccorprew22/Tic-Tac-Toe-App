'''
    
'''

import unittest
from app import on_player_joined, on_replay, TWO_PLAYER, OVERALL_LST, DISPLAY_LST, NUM_PLAYERS

DATA_INPUT = "username"
EXPECTED_OUTPUT = "expected"

class OnDisconnectTestCase(unittest.TestCase):
    
    def setUp(self):
        self.success_test_params = [
            {
                #{ sid: socket.id}
                DATA_INPUT: {
                    'sid': "a1"
                },
                EXPECTED_OUTPUT: [["a1"]
            },
            {
                #{ sid: socket.id}
                DATA_INPUT: {
                    'sid': "b2"
                },
                EXPECTED_OUTPUT: ["a1"]
            },
            {
                #{ sid: socket.id}
                DATA_INPUT: {
                    'sid': "c3"
                },
                EXPECTED_OUTPUT: ["a1", "c3"]
            }
        ]

    def test_on_disconnect(self):
        
        on_player_joined({
                'sid': "a1",
                'username': "chris123",
                'num_players': 0,
                'two_players': [],
                'players': []
            })
        on_player_joined({
                'sid': "b2",
                'username': "steve123",
                'num_players': 1,
                'two_players': [],
                'players': []
            })
        on_player_joined({
                'sid': "c3",
                'username': "steve123",
                'num_players': 1,
                'two_players': [],
                'players': []
            })
        
        for test in self.success_test_params:
            
            actual_result = on_replay(test[DATA_INPUT])
            
            expected_result = test[EXPECTED_OUTPUT]
            self.assertEqual(len(actual_result), len(expected_result))
            self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()