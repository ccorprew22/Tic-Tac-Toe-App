'''
    on_replay_test.py

    Tests to see if on_replay properly handles players hitting rematch by
    active players and spectators.
'''

import unittest
#import unittest.mock as mock
from unittest.mock import patch
import sys
import os

sys.path.append(os.path.abspath("../../"))
from app import on_player_joined, on_replay

DATA_INPUT = "username"
EXPECTED_OUTPUT = "expected"


class OnReplayTestCase(unittest.TestCase):
    """On replay test case class"""
    def setUp(self):
        self.success_test_params = [
            {
                #{ sid: socket.id}
                DATA_INPUT: {
                    'sid': "a1"
                },
                EXPECTED_OUTPUT: ["a1"]
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

    def test_on_replay(self):
        """on replay test cases"""
        #these are sample people to populate list
        on_player_joined({
            'sid': "a1",
            'username': "chris123",
            'num_players': 0,
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
            print(actual_result)


if __name__ == '__main__':
    unittest.main()
