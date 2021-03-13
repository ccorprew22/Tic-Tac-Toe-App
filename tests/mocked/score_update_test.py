"""
    score_update_test.py

    Tests to see if score is update properly for both users.
"""

import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import score_update, on_player_joined
import Players

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'person1'


class ScoreUpdateTestCase(unittest.TestCase):
    """
    Score Update test class
    """
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: ['a1', 'a1', 'b2'],
                KEY_EXPECTED: [101, 99]
            }
        ]

        initial_person1 = Players.Player(username='guy1', score=100)
        initial_person2 = Players.Player(username='guy2', score=100)
        self.initial_db_mock = [initial_person1, initial_person2]

    def mocked_player_query_filter_first(self):
        """
        Mocked query.filter
        """
        self.initial_db_mock[0].score += 1
        self.initial_db_mock[1].score -= 1
        print(self.initial_db_mock[0] )
        return self.initial_db_mock

    def test_success(self):
        """test_success function"""
        on_player_joined({
            'sid': "a1",
            'username': "guy1",
            'num_players': 0,
            'two_players': [],
            'players': []
        })

        on_player_joined({
            'sid': "b2",
            'username': "guy2",
            'num_players': 1,
            'two_players': [],
            'players': []
        })
        for test in self.success_test_params:
            with patch('app.DB.session.query') as mocked_query1:
                with patch('app.DB.session.query.filter.first', self.mocked_player_query_filter_first):
                    actual_result = score_update(test[KEY_INPUT][0],test[KEY_INPUT][1],test[KEY_INPUT][2])
                    print("ACTUAL: " + str(actual_result))
                    expected_result = test[KEY_EXPECTED]
    
                    print("EXPECTED: " + str(expected_result))
                    print(self.initial_db_mock)
                    self.assertEqual(len(actual_result), len(expected_result))
                    self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
