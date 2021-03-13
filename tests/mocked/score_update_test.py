"""
    score_update_test.py

    Tests to see if score is update properly for both users.
"""

import unittest
#import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import score_update
#import Players

KEY_INPUT = "input"
KEY_EXPECTED = "expected"

INITIAL_USERNAME = 'person1'


class ScoreUpdateTestCase(unittest.TestCase):
    """
    Add usernme test class
    """
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'person2A',
                KEY_EXPECTED: "New User Added: person2A",
            },
            
        ]

        #initial_person = Players.Player(username=INITIAL_USERNAME, score=100)
        self.initial_db_mock = []

    def mocked_db_session_add(self, username):
        """
        Mocked db.session.add
        """
        if str(username) in self.initial_db_mock:
            raise Exception
        self.initial_db_mock.append(str(username))

    def test_success(self):
        """test_success function"""
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                actual_result = add_username(test[KEY_INPUT])
                print("ACTUAL: " + actual_result)
                expected_result = test[KEY_EXPECTED]

                print("EXPECTED: " + expected_result)
                print(self.initial_db_mock)
                self.assertEqual(len(actual_result), len(expected_result))
                self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
